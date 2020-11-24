import { v4 as uuidv4 } from 'uuid'

import { UserInfo } from '../types'
import { db, firebase, storageRef } from './config'

export const usersRef = db.collection('users')
export const productImagesFolder = 'products'

export const snapshotToUserInfo = (
  doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) => {
  const docData = doc.data() as Omit<UserInfo, 'id'>
  const userInfo: UserInfo = {
    id: doc.id,
    ...docData,
  }

  return userInfo
}

export const createImageRef = (imageName: string) => {
  const uuid = uuidv4()

  return storageRef.child(`${productImagesFolder}/${imageName}-${uuid}`)
}
