import sharp from 'sharp';

async function fitCampLogoInCircle() {
  try {
    // Load both images
    const logo = sharp('client/public/branding/camplogo.png');
    const target = sharp('client/public/branding/campnavi-logo.png');

    // Get metadata
    const logoMeta = await logo.metadata();
    const targetMeta = await target.metadata();

    console.log('CampLogo dimensions:', logoMeta.width, 'x', logoMeta.height);
    console.log('Target dimensions:', targetMeta.width, 'x', targetMeta.height);

    // The circle appears to be in the upper portion of the image (above the "CAMPNAVI" text)
    // Based on the image, the circle is roughly circular and positioned in the upper half
    // Let's estimate the circle diameter - looking at the image, it's about 45% of the image width
    const circleDiameter = Math.floor(targetMeta.width * 0.45);
    const circleX = Math.floor((targetMeta.width - circleDiameter) / 2);
    // Position circle in the upper portion (about 15% from top - circle is higher up)
    const circleY = Math.floor(targetMeta.height * 0.15);

    console.log('Circle position:', circleX, circleY);
    console.log('Circle diameter:', circleDiameter);

    // Resize logo to fit inside circle (with padding to ensure it stays within circle)
    const padding = 12;
    const logoSize = circleDiameter - (padding * 2);

    const resizedLogo = await logo
      .resize(logoSize, logoSize, {
        fit: 'inside',
        withoutEnlargement: false,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Get the actual resized dimensions
    const resizedMeta = await sharp(resizedLogo).metadata();
    console.log('Resized logo dimensions:', resizedMeta.width, 'x', resizedMeta.height);

    // Calculate center position for the logo - center of the circle
    const circleCenterX = circleX + Math.floor(circleDiameter / 2);
    const circleCenterY = circleY + Math.floor(circleDiameter / 2);
    
    const logoX = circleCenterX - Math.floor(resizedMeta.width / 2);
    const logoY = circleCenterY - Math.floor(resizedMeta.height / 2);

    console.log('Logo position:', logoX, logoY);

    // Composite the logo onto the target image
    const result = await target
      .composite([{
        input: resizedLogo,
        left: logoX,
        top: logoY
      }])
      .toFile('client/public/branding/campnavi-logo-temp.png');

    // Replace the original file
    const fs = await import('fs');
    fs.copyFileSync('client/public/branding/campnavi-logo-temp.png', 'client/public/branding/campnavi-logo.png');
    fs.unlinkSync('client/public/branding/campnavi-logo-temp.png');

    console.log('Successfully updated campnavi-logo.png with camplogo.png');
  } catch (error) {
    console.error('Error:', error);
  }
}

fitCampLogoInCircle();
