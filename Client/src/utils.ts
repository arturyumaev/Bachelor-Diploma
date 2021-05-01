const getSession = (): string => {
  return document.cookie.split('=')[1];
}

export default getSession;
