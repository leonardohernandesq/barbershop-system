import { createContext, ReactNode, useState, useEffect } from "react";
import Router from "next/router";

import {destroyCookie, setCookie, parseCookies} from 'nookies'
import { api } from "../services/apiClient";

interface IAuthContextData{
    user: IUserProps
    isAuthenticated: boolean;
    signIn: (credentials: ISignInProps) => Promise<void>
    signUp: (credentials: IRegisterProps) => Promise<void>
    logoutUser: () => Promise<void>
}

interface IUserProps{
    id: string,
    name: string,
    email: string,
    endereco: string | null,
    subscriptions?: ISubscriptionProps | null
}

interface ISubscriptionProps{
    id: string;
    status: string;
}

interface ISignInProps{
    email: string;
    password: string;
}

interface IRegisterProps{
    name: string;
    email: string;
    password:string;
}

type TAuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as IAuthContextData)

export function signOut(){
    console.log("Error Logout")

    try{
        destroyCookie(null, '@barber.token', {path: '/'})
        Router.push('/login')
    } catch(err){
        console.log("erro ao sair")
    }
} 

export function AuthProvider({ children }: TAuthProviderProps){
    const [user, setUser] = useState<IUserProps>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@barber.token': token} = parseCookies();

        if(token){
            api.get('/me').then(response => {
                const { id, name, endereco, email, subscriptions } = response.data;
                setUser({
                    id,
                    name,
                    email,
                    endereco,
                    subscriptions
                })
            })
            .catch(() => {
                signOut();
            })
        }
    }, [])

    async function signIn({email, password}: ISignInProps){
        try{
            const response = await api.post('/session', {
                email,
                password,
            })

            const { id, name, token, subscriptions, endereco } = response.data

            setCookie(undefined, '@barber.token', token, {
                maxAge: 60*60*24*30, //expirar em 1 mês
                path: '/'
            })

            setUser({
                id,
                name,
                email,
                endereco,
                subscriptions
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            Router.push('/dashboard')

            console.log(response.data)
        }catch(err){
            alert('Erro ao entrar' + err)
        }
    }

    async function signUp({name, email, password}: IRegisterProps){
        try{
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            Router.push("/login")

        }catch(err){
            alert('Erro ao cadastrar' + err)
        }
    }

    async function logoutUser(){
        try{
            destroyCookie(null, '@barber.token', {path: '/'})
            setUser(null)
            Router.push('/login')
        }catch(err){
            alert('Erro ao sair' + err)
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}