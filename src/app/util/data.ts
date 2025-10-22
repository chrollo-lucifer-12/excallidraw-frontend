import axios from "axios";

export const getWhiteboards = async (token: string) => {
  const data = await axios.get(
    "http://localhost:8000/api/v1/user/whiteboards",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(data, "white");
  return data.data;
};
