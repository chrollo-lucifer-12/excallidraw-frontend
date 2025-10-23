import axios from "axios";

export const getWhiteboards = async (token: string) => {
  try {
    const data = await axios.get(
      "http://localhost:8000/api/v1/user/whiteboards",
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
