import { User, IUserRepository, UserStatus, UserRole, Gender } from "../../domain";
import { db, COLLECTIONS } from "../database/firebase";

export class FirestoreUserRepository implements IUserRepository {
  private readonly collection = db.collection(COLLECTIONS.USERS);

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return this.mapToEntity(snapshot.docs[0]);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.mapToEntity(doc);
  }

  async create(user: User): Promise<User> {
    const data = this.mapToFirestore(user);
    const docRef = await this.collection.add(data);
    return User.fromPersistence({ ...user.toObject(), id: docRef.id });
  }

  async update(user: User): Promise<User> {
    const data: Record<string, unknown> = {
      name: user.name,
      lastname: user.lastname,
      lastActivity: user.lastActivity,
    };
    if (user.phone !== undefined) data.phone = user.phone;
    
    await this.collection.doc(user.id!).update(data);
    return user;
  }

  private mapToEntity(doc: FirebaseFirestore.DocumentSnapshot): User {
    const data = doc.data()!;
    return User.fromPersistence({
      id: doc.id,
      uuid: data.uuid,
      email: data.email,
      name: data.name,
      lastname: data.lastname,
      phone: data.phone,
      birthDate: data.birthDate?.toDate(),
      gender: data.gender as Gender,
      country: data.country,
      termsAccepted: data.termsAccepted,
      privacyPolicyAccepted: data.privacyPolicyAccepted,
      notificationPreferences: data.notificationPreferences,
      status: data.status as UserStatus,
      role: data.role as UserRole,
      registrationData: {
        ipAddress: data.registrationData?.ipAddress,
        userAgent: data.registrationData?.userAgent,
        timestamp: data.registrationData?.timestamp?.toDate() || new Date(),
      },
      lastActivity: data.lastActivity?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    });
  }

  private mapToFirestore(user: User): Record<string, unknown> {
    const data: Record<string, unknown> = {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      termsAccepted: user.termsAccepted,
      privacyPolicyAccepted: user.privacyPolicyAccepted,
      notificationPreferences: user.notificationPreferences,
      status: user.status,
      role: user.role,
      registrationData: user.registrationData,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
    };

    // Only add optional fields if they have values (Firestore doesn't accept undefined)
    if (user.phone !== undefined) data.phone = user.phone;
    if (user.birthDate !== undefined) data.birthDate = user.birthDate;
    if (user.gender !== undefined) data.gender = user.gender;
    if (user.country !== undefined) data.country = user.country;

    return data;
  }
}
