/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/notam', 
          destination: 'https://lentopaikat.fi/notam/notam.php?a=EFPR', 
        },
      ];
    },
  };
  
  export default nextConfig;
  
