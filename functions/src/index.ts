import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const env = functions.config()

export const onSignup = functions.https.onCall(async (data, context) => {
  try {
    const { username } = data as { username: string }

    if (!context.auth?.uid) return

    // 1. Create a role on the user in the firebase authentication
    await admin.auth().setCustomUserClaims(context.auth.uid, {
      role:
        context.auth.token.email === env.admin.super_admin
          ? 'SUPER_ADMIN'
          : 'CLIENT',
    })

    // 2. Create a new user document in the users collection in firestore
    const result = await admin
      .firestore()
      .collection('users')
      .doc(context.auth?.uid)
      .set({
        username,
        email: context.auth.token.email,
        role:
          context.auth.token.email === env.admin.super_admin
            ? 'SUPER_ADMIN'
            : 'CLIENT',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    if (!result) return

    return { message: 'User has been created on firestore.' }
  } catch (error) {
    throw error
  }
})
