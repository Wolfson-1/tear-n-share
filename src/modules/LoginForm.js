import React, { useEffect } from 'react'
import {db} from '../firebase/config';
import useFetchDoc from '../hooks/useFetchDoc';

export default function LoginForm() {

  const testData = useFetchDoc(db,['test','eB6OR2AIVvIZlrAUqPOL']);

  return (
    <>
    {testData ? <div>
      {testData.test}
    </div>: null}
    </>
  )
}
