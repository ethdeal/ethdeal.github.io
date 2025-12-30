import { useEffect } from 'react';

const GoogleSheetsIntegration = () => {
  useEffect(() => {
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');
    const scriptURL =
      'https://script.google.com/macros/s/AKfycbzu_yOlvNBSD08Fb-MpgZ4nyFR_xKrNpTz_dJXgTjhZLRmkqGsG7hx1jOW4i_qr3qUJoQ/exec';
    console.log(form);

    const handleSubmit = (e) => {
      e.preventDefault();
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(() => {
          msg.innerHTML = 'Message sent successfully';
          setTimeout(() => {
            msg.innerHTML = '';
          }, 5000);
          form.reset();
        })
        .catch((error) => console.error('Error!', error.message));
    };

    form.addEventListener('submit', handleSubmit);
    return () => form.removeEventListener('submit', handleSubmit);
  }, []);

  return null;
};

export default GoogleSheetsIntegration;
