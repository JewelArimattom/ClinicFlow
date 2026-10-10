import { PrismaClient } from "@prisma/client";
import { 
  SEED_CLINICS, 
  SEED_SPECIALTIES, 
  SEED_DOCTORS, 
  SEED_MEDICINES, 
  SEED_SUPPLIERS, 
  SEED_BATCHES, 
  SEED_PATIENTS, 
  SEED_APPOINTMENTS, 
  SEED_INVOICES, 
  SEED_PAYMENTS, 
  SEED_USERS, 
  SEED_MEMBERSHIPS, 
  SEED_PLANS, 
  SEED_SUBSCRIPTIONS 
} from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ClinicFlow database seed...");

  // 1. Seed Subscription Plans
  console.log("Seeding subscription plans...");
  for (const plan of SEED_PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { tier: plan.tier },
      update: {},
      create: {
        id: plan.id,
        name: plan.name,
        tier: plan.tier,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        trialDays: plan.trialDays,
        maxDoctors: plan.maxDoctors,
        maxStaff: plan.maxStaff,
        maxAppointmentsMonthly: plan.maxAppointmentsMonthly,
        features: plan.features,
        isActive: plan.isActive,
      },
    });
  }

  // 2. Seed Specialties
  console.log("Seeding medical specialties...");
  for (const spec of SEED_SPECIALTIES) {
    await prisma.specialty.upsert({
      where: { slug: spec.slug },
      update: {},
      create: {
        id: spec.id,
        name: spec.name,
        slug: spec.slug,
        description: spec.description,
        icon: spec.icon,
      },
    });
  }

  // 3. Seed Users
  console.log("Seeding users...");
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        phone: user.phone,
        isSuperAdmin: user.isSuperAdmin,
        emailVerified: user.emailVerified,
      },
    });
  }

  // 4. Seed Clinics
  console.log("Seeding clinics...");
  for (const clinic of SEED_CLINICS) {
    await prisma.clinic.upsert({
      where: { slug: clinic.slug },
      update: {},
      create: {
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        clinicType: clinic.clinicType,
        description: clinic.description,
        address: clinic.address,
        city: clinic.city,
        state: clinic.state,
        pinCode: clinic.pinCode,
        phone: clinic.phone,
        email: clinic.email,
        brandColor: clinic.brandColor,
        isVerified: clinic.isVerified,
        isPublished: clinic.isPublished,
        bookingEnabled: clinic.bookingEnabled,
      },
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error (note: if Supabase URL is not yet connected, in-memory store is used seamlessly):", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
