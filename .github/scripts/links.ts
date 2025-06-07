import 'dotenv/config'

import { z } from 'zod'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { firestore as store } from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

const envSchema = z.object({
  FIREBASE_PRIVATE_KEY_BASE64: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  GITHUB_REF_NAME: z.string(),
  GITHUB_SHA: z.string(),
})

const env = envSchema.safeParse(process.env)
if (env.error) {
  console.error(env.error)
  process.exit(1)
}

let app: ReturnType<typeof initializeApp>
const apps = getApps()

if (apps.length > 0) {
  app = apps[0]
} else {
  app = initializeApp({
    credential: cert({
      privateKey: Buffer.from(
        env.data.FIREBASE_PRIVATE_KEY_BASE64,
        'base64',
      ).toString(),
      clientEmail: env.data.FIREBASE_CLIENT_EMAIL,
      projectId: env.data.FIREBASE_PROJECT_ID,
    }),
  })
}

const firestore = getFirestore(app)

const windowsLinks = [
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator-{{version-without-v}}-setup.exe',
]

const linuxLinks = [
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator-{{version-without-v}}.AppImage',
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator-{{version-without-v}}.freebsd',
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator-{{version-without-v}}.pacman',
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator-{{version-without-v}}.x86_64.rpm',
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator_{{version-without-v}}_amd64.deb',
]

const macosLinks = [
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/queue-optimization-calculator-{{version-without-v}}.dmg',
  'https://github.com/pedroaba/queue-optimization-calculator/releases/download/{{version}}/Queue.Models.Calculator-{{version-without-v}}-arm64-mac.zip',
]

const secrets = envSchema.parse(process.env)
function _replaceVersion(link: string) {
  return link
    .replace('{{version}}', secrets.GITHUB_REF_NAME)
    .replace('{{version-without-v}}', secrets.GITHUB_REF_NAME.replace('v', ''))
}

const docRef = firestore.collection('links').doc(secrets.GITHUB_REF_NAME)
docRef
  .set({
    version: secrets.GITHUB_REF_NAME,
    createdAt: store.Timestamp.now(),
    sha: secrets.GITHUB_SHA,
    links: {
      windows: windowsLinks.map(_replaceVersion),
      linux: linuxLinks.map(_replaceVersion),
      macos: macosLinks.map(_replaceVersion),
    },
  })
  .then((doc) => {
    console.log('Document written on: ', doc.writeTime)
  })
  .catch((error) => {
    console.error('Error adding document: ', error)
  })
  .finally(() => {
    console.log('Done')
    process.exit(0)
  })
