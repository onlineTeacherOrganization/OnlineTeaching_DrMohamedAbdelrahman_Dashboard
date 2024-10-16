const GetUserToken = () => {
  const tokenString = sessionStorage.getItem("token");
  const token = JSON.parse(tokenString);
  return token;
};

export default GetUserToken;
