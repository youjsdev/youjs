'use client';

import { useEffect, useState } from 'react';

const PasswordProtected = ({ password, scheme, color }: { password: string; scheme: string; color: string }) => {
  const openColorMappings = {
    // use the 5 color
    gray: '#adb5bd',
    red: '#ff6b6b',
    pink: '#f06595',
    grape: '#cc5de8',
    violet: '#845ef7',
    indigo: '#5c7cfa',
    blue: '#339af0',
    cyan: '#22b8cf',
    teal: '#20c997',
    green: '#51cf66',
    lime: '#94d82d',
    yellow: '#fcc419',
    orange: '#ff922b',
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <></>;

  function setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  function getCookie(name: string) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setCookie('password', e.target.password.value, 1);

    window.location.reload();
  };

  return getCookie('password') !== password ? (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          
    :root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --text-color-light: #777777;
  --input-border-color: #e0e0e0;
  --input-focus-border-color: ${openColorMappings[color as keyof typeof openColorMappings]};
  --button-bg-color: ${openColorMappings[color as keyof typeof openColorMappings]};
  --button-bg-color-hover: ${openColorMappings[color as keyof typeof openColorMappings]} * 0.9; 
}

.dark-theme {
  --bg-color: #2c2c2c;
  --text-color: #f1f1f1;
  --text-color-light: #aaaaaa;
  --input-border-color: #4a4a4a;
}

.password-protected {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.password-protected__container {
  background-color: var(--bg-color);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.password-protected__title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: var(--text-color);
}

.password-protected__description {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--text-color-light);
  line-height: 1.6;
}

.password-protected__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-protected__input {
  padding: 0.75rem;
  border: 2px solid var(--input-border-color);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.password-protected__input:focus {
  border-color: var(--input-focus-border-color);
}

.password-protected__button {
  background-color: var(--button-bg-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.password-protected__button:hover {
  filter: brightness(0.75);
}
`,
        }}
      />
      <div className={`password-protected${scheme === 'dark' ? ' dark-theme' : ''}`}>
        <div className="password-protected__container">
          <h1 className="password-protected__title">Password Protected</h1>
          <p className="password-protected__description">
            This page is password protected. Please enter the password to view the page.
          </p>
          <form className="password-protected__form" onSubmit={handleSubmit}>
            <input name="password" className="password-protected__input" type="password" placeholder="Password" />
            <button className="password-protected__button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default PasswordProtected;
