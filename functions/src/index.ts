import { onObjectFinalized } from 'firebase-functions/v2/storage';
import * as admin from 'firebase-admin';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

admin.initializeApp();
const db = admin.firestore();

export const generatePdfThumbnail = onObjectFinalized({ timeoutSeconds: 60, memory: '1GiB' }, async (event) => {
  const object = event.data;
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name;

  if (!filePath || !filePath.endsWith('.pdf')) return;

  const fileName = path.basename(filePath);
  const baseFileName = fileName.replace(/\.pdf$/, '');
  const tempLocalFile = path.join(os.tmpdir(), fileName);
  const tempOutputImage = path.join(os.tmpdir(), `${baseFileName}.jpg`);
  const thumbnailPath = filePath.replace(/\.pdf$/, '_thumb.jpg');

  console.log(`📄 Verwerken van: ${filePath}`);

  // 1. PDF downloaden
  await bucket.file(filePath).download({ destination: tempLocalFile });

  const pdfBuffer = fs.readFileSync(tempLocalFile);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();

  // 2. Simpele preview genereren
  const previewBuffer = await sharp({
    create: {
      width: Math.round(width),
      height: Math.round(height),
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${width}" height="${height}">
            <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>
            <text x="50%" y="50%" font-size="24" text-anchor="middle" fill="#555" dy=".3em">PDF Preview</text>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
    ])
    .jpeg()
    .toBuffer();

  fs.writeFileSync(tempOutputImage, previewBuffer);

  // 3. Thumbnail uploaden met metadata
  const [uploadedFile] = await bucket.upload(tempOutputImage, {
    destination: thumbnailPath,
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        firebaseStorageDownloadTokens: crypto.randomUUID(),
      },
    },
  });

  // 4. Download URL genereren
  const encodedPath = encodeURIComponent(thumbnailPath);
  const [metadata] = await uploadedFile.getMetadata();
  const token = metadata.metadata?.firebaseStorageDownloadTokens;

  const thumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/${encodedPath}?alt=media&token=${token}`;

  // 5. Bijbehorend Firestore document vinden en bijwerken
  const recipesRef = db.collection('recipes');
  const snapshot = await recipesRef.where('fileUrl', '==', object.mediaLink).get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await doc.ref.update({ thumbnailUrl });
    console.log(`✅ Firestore bijgewerkt met thumbnail voor ${doc.id}`);
  } else {
    console.warn('⚠️ Geen recipe gevonden voor dit bestand, thumbnailUrl niet opgeslagen.');
  }

  // 6. Opschonen
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempOutputImage);

  console.log(`✅ Thumbnail opgeslagen als: ${thumbnailPath}`);
});
