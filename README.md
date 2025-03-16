This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Image Upload Feature

To enable image uploads with Supabase Storage, follow these steps:

1. Go to your Supabase project dashboard
2. Navigate to Storage in the sidebar
3. Create a new bucket named `items` with the following settings:

   - Public bucket: Yes (to allow public access to images)
   - File size limit: Set as needed (recommended: 5MB for images)
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

4. Set up bucket policies:

   - Go to the "Policies" tab for your `items` bucket
   - Add a policy for INSERT operations:

     - Policy name: "Allow authenticated uploads"
     - Allowed operation: INSERT
     - Target roles: authenticated
     - Policy definition: true (or customize as needed)

   - Add a policy for SELECT operations:
     - Policy name: "Allow public access"
     - Allowed operation: SELECT
     - Target roles: anon, authenticated
     - Policy definition: true

5. Make sure your Supabase client is properly initialized with storage permissions

### Troubleshooting Storage Issues

If you encounter a "bucket not found" error (400):

1. Verify the bucket name in your code matches exactly what's in Supabase (case-sensitive)
2. Check that your Supabase API key has storage permissions
3. Ensure the bucket policies are correctly set up
4. Try creating a test file directly in the Supabase dashboard to verify bucket access
5. Check browser console for detailed error messages
6. Verify that your `.env` file contains the correct Supabase URL and API key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
   ```
7. If using RLS (Row Level Security), ensure your policies allow the operations you're trying to perform

For image display issues:

1. Make sure your Next.js config includes the correct Supabase domain in the `images.remotePatterns` configuration
2. Check that the image URL format matches what Supabase provides
3. Verify the image exists in your Supabase storage bucket
