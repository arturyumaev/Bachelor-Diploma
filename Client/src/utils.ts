const getSession = (): string => {
  const cookie = document.cookie;
  return cookie.slice(cookie.indexOf('session')).split('=')[1];
}

export default getSession;
