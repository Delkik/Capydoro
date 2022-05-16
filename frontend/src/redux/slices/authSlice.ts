import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { initializeApp } from "firebase/app";
import { User, signInWithEmailAndPassword, getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, AuthError, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseConfig } from "../../configs/firebase";

interface LoginInfo {
    email: string,
    password: string
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInUser = createAsyncThunk('auth/signIn', async (info: LoginInfo, thunkApi) => {
    const { email, password } = info;
    try {
        // console.log("Sign in called in thunk")
        const response = await signInWithEmailAndPassword(auth, email, password).then((newUser) => newUser.user.getIdToken());
        return response;
    }
    catch (err) {
        const error = err as AuthError;
        console.log(error.code)
        return thunkApi.rejectWithValue(error.code)
    }
})

export const googleSignIn = createAsyncThunk('auth/googleSignIn', async (_, thunkApi) => {
    try {
        // console.log("Sign in called in thunk")
        const response = await signInWithPopup(auth, provider).then((result) => {
            return result.user.getIdToken();
        });
        return response;
    }
    catch (err) {
        const error = err as AuthError;
        console.log(error.code)
        return thunkApi.rejectWithValue(error.code)
    }
})

export const passwordReset = createAsyncThunk('auth/passwordReset', async (email: string, thunkApi) => {
    try {
        // console.log("Sign in called in thunk")
        await sendPasswordResetEmail(auth, email);
        return 'Email Sent';
    }
    catch (err) {
        const error = err as AuthError;
        console.log(error.code)
        return thunkApi.rejectWithValue(error.code)
    }
})

export const signUpUser = createAsyncThunk('auth/signUp', async (info: LoginInfo, thunkApi) => {
    const { email, password } = info;
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password).then((newUser) => newUser.user.getIdToken());
        return response;
    }
    catch (err) {
        const error = err as AuthError;
        return thunkApi.rejectWithValue(error.code)
    }
})

interface Auth {
    user: string | null,
    error: string | null
}

const initialState: Auth = { user: null, error: null }

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        signIn: (state: Auth, { payload }: PayloadAction<string>) => {
            state.user = payload;
        },
        signOut: (state: Auth) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.fulfilled, (state, { payload }) => {
                state.user = payload as string;
            })
            .addCase(signInUser.rejected, (state, { payload }) => {
                state.error = payload as string;
            })
            .addCase(googleSignIn.fulfilled, (state, { payload }) => {
                state.user = payload as string;
            })
            .addCase(googleSignIn.rejected, (state, { payload }) => {
                state.error = payload as string;
            })
            .addCase(signUpUser.fulfilled, (state, { payload }) => {
                state.user = payload as string;
            })
            .addCase(signUpUser.rejected, (state, { payload }) => {
                state.error = payload as string;
            })
            .addCase(signOut, (state) => {
                state.user = null;
            })
    }
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;