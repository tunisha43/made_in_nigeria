/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add Supabase Storage domain here once the project is provisioned, e.g.:
      // { protocol: 'https', hostname: '<project-ref>.supabase.co', pathname: '/storage/v1/object/public/**' }
    ],
  },
};

export default nextConfig;
