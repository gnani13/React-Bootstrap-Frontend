import { z } from 'zod';
import { insertUserSchema, insertDonationSchema, loginCredentialsSchema, users, donations, assignments } from './schema';

// API Contract matching the Spring Boot Backend
export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        200: z.object({ token: z.string(), user: z.custom<typeof users.$inferSelect>() }),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginCredentialsSchema,
      responses: {
        200: z.object({ token: z.string(), user: z.custom<typeof users.$inferSelect>() }),
      },
    },
    profile: {
      method: 'GET' as const,
      path: '/api/auth/profile',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    },
  },
  donations: {
    create: {
      method: 'POST' as const,
      path: '/api/donations',
      input: insertDonationSchema.omit({ id: true, createdAt: true, donorId: true, claimedByNgoId: true, status: true }),
      responses: {
        201: z.custom<typeof donations.$inferSelect>(),
      },
    },
    myDonations: {
      method: 'GET' as const,
      path: '/api/donations/my-donations',
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
    available: {
      method: 'GET' as const,
      path: '/api/donations/available',
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
    claim: {
      method: 'POST' as const,
      path: '/api/donations/:id/claim',
      responses: {
        200: z.custom<typeof donations.$inferSelect>(),
      },
    },
    ngoMyDonations: {
      method: 'GET' as const,
      path: '/api/donations/ngo/my-donations',
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
  },
  analytics: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/analytics/dashboard',
      responses: {
        200: z.object({
          totalDonations: z.number(),
          activeDonations: z.number(),
          totalMealsSaved: z.number()
        }),
      },
    },
    userStats: {
      method: 'GET' as const,
      path: '/api/analytics/user-stats',
      responses: {
        200: z.object({
          donationsCount: z.number(),
          impactScore: z.number()
        }),
      },
    },
  },
  volunteer: {
    myAssignments: {
      method: 'GET' as const,
      path: '/api/volunteer/my-assignments',
      responses: {
        200: z.array(z.custom<typeof assignments.$inferSelect>()),
      },
    },
    updateStatus: {
      method: 'POST' as const,
      path: '/api/volunteer/assignment/:id/status',
      input: z.object({ status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]) }),
      responses: {
        200: z.custom<typeof assignments.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
