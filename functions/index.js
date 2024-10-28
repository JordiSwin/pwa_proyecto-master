const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu_email@gmail.com',
    pass: 'tu_contraseña_de_gmail', // O clave de aplicación si tienes autenticación en dos pasos
  },
});

exports.sendPurchaseEmail = functions.https.onCall(async (data, context) => {
  const { userEmail, cart, totalPrice } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'No autenticado');
  }

  const mailOptions = {
    from: 'tu_email@gmail.com',
    to: userEmail,
    subject: 'Confirmación de tu compra',
    html: `
      <h1>Gracias por tu compra</h1>
      <p>Has realizado una compra con éxito.</p>
      <h2>Resumen de la compra:</h2>
      ${cart.map(
        (product) => `
        <div>
          <h3>${product.name}</h3>
          <p>Precio: $${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
          <p>Total Producto: $${product.price * product.quantity}</p>
        </div>
      `
      ).join('')}
      <h2>Total de la compra: $${totalPrice}</h2>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new functions.https.HttpsError('internal', 'Error al enviar el correo');
  }
});
