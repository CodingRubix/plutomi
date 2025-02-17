import { baseAPIUrl } from "@/utils/baseAPIUrl";

export const runtime = "experimental-edge";

const Test = ({ data }: any) => <div>SSR Page - {data}</div>;

export const getServerSideProps = async () => {
  const res = await fetch(`${baseAPIUrl}/ssr`);

  const data = await res.text();
  return {
    props: {
      data
    }
  };
};
export default Test;
