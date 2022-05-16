import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, AuthError, signInWithPopup, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from '../../configs/firebase';
import { api } from './api'


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();


const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        signInUser: build.mutation<string, { email: string, password: string }>({
            queryFn: async ({ email, password }: { email: string, password: string }) => {
                try {
                    // console.log("Sign in called in thunk")
                    // console.log(endpoint)
                    const response = await signInWithEmailAndPassword(auth, email, password).then((newUser) => newUser.user.getIdToken());
                    // fetch(tasksApi.util.)
                    return { data: response };
                }
                catch (err) {
                    const error = err as AuthError;
                    console.log(error.code)
                    return { error: { error: error.code, status: 'CUSTOM_ERROR', data: { errorMsg: "Failed to sign in." } } }
                }
            }
        }),
        signInWithGoogle: build.mutation<string, void>({
            queryFn: async (_, { endpoint }) => {
                try {
                    // console.log(endpoint)
                    // console.log("Sign in called in thunk")
                    const response = await signInWithPopup(auth, provider).then((newUser) => newUser.user.getIdToken());
                    await fetch('http://localhost:5000/signup', { method: 'GET', headers: { 'Authorization': response } })
                    return { data: response };
                }
                catch (err) {
                    const error = err as AuthError;
                    console.log(error.code)
                    return { error: { error: error.code, status: 'CUSTOM_ERROR', data: { errorMsg: "Failed to sign in." } } }
                }
            }
        }),
        signUpUser: build.mutation<string, { email: string, password: string }>({
            queryFn: async ({ email, password }: { email: string, password: string }) => {
                try {
                    // console.log("Sign in called in thunk")
                    const response = await createUserWithEmailAndPassword(auth, email, password).then((newUser) => newUser.user.getIdToken());
                    await fetch('http://localhost:5000/signup', { method: 'GET', headers: { 'Authorization': response } })
                    return { data: response };
                }
                catch (err) {
                    const error = err as AuthError;
                    console.log(error.code)
                    return { error: { error: error.code, status: 'CUSTOM_ERROR', data: { errorMsg: "Failed to sign up." } } }
                }
            }
        }),
        signOutUser: build.mutation<string, void>({
            queryFn: async () => {
                try {
                    // console.log("Sign in called in thunk")
                    await signOut(auth);
                    return { data: "Sign out successful" };
                }
                catch (err) {
                    const error = err as AuthError;
                    console.log(error.code)
                    return { error: { error: error.code, status: 'CUSTOM_ERROR', data: { errorMsg: "Failed to sign out." } } }
                }
            }
        }),
    }),
    overrideExisting: false,
})

export const {
    useSignInUserMutation,
    useSignInWithGoogleMutation,
    useSignUpUserMutation,
    useSignOutUserMutation
} = authApi;