import axios from "axios";

export const getWhiteboards = async (token: string) => {
  try {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/whiteboards`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data.data.whiteboards;
  } catch (err: any) {
    throw err;
  }
};
