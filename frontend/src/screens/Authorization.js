/* eslint-disable */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Logo from '../../assets/images/Logo.png'
import {CustomButton, CustomInput} from "../components"
import {useContext, useEffect, useRef, useState} from "react";
import {designChoices} from "../../GlobalConsts";
import {AuthContext} from "../../auth-context";
import {useMutation} from "@apollo/client";
import {CREATE_USER, LOGIN_USER} from "../graphql";
import {useAlert} from "../../useAlert";

export const Login = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginMutation, {loading, error, data}] = useMutation(LOGIN_USER)
    const {setAlert} = useAlert()
    const {login} = useContext(AuthContext)
    const login_user = () => {
        try {
            loginMutation({variables: {email, password}})
                .then((r) => {
                    if (r.data.loginUser.accessToken) {
                        login(r.data.loginUser.accessToken)
                        setAlert('Login Successful!', 'success')
                        navigation.navigate('MainScreen')
                    } else {
                        setAlert('Invalid Credentials! Try again.', 'error')
                    }
                })
        } catch (e) {
            setAlert(e, 'error')
        }
    }
    return (
        <View style={styles.root}>
            <Image source={Logo} style={styles.logo} resizeMode={'contain'}/>
            <CustomInput value={email} setValue={setEmail} placeholder={'Email'}/>
            <CustomInput value={password} setValue={setPassword} placeholder={'Password'} secureTextEntry={true}/>
            <CustomButton onPress={login_user} text={'Log In'}/>
            <Text>Don't have an account yet? <Text onPress={() => navigation.navigate('Signup')}>Signup</Text></Text>
        </View>
    )
}

export const Signup = ({navigation}) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const checkConfirmPassword = (password) => {
        setConfirmPassword(() => password)
    }
    const length8 = useRef(null)
    const passMatch = useRef(null)
    const [signupMutation, {loading, error, data}] = useMutation(CREATE_USER)
    useEffect(() => {
        length8.current.setNativeProps({
            style: {color: password.length >= 8 ? 'green' : 'red'}
        })
        passMatch.current.setNativeProps({
            style: {color: password === confirmPassword && password.length > 0 ? 'green' : 'red'}
        })
    }, [password, confirmPassword]);
    const {setAlert} = useAlert()
    const signUp = () => {
        if ((password.length < 8) || (password !== confirmPassword) || (email === '') || (firstName === '') || (lastName === '')) {
            setAlert('Please fill in all the fields properly!', 'error')
        } else {
            try {
                signupMutation({variables: {email, password, firstName, lastName}})
                    .then((r) => {
                        if (r.data.createUser.success === "true") {
                            setAlert('Signup Successful', 'success')
                            navigation.navigate('Login')
                        } else {
                            setAlert(r.data.createUser.message, 'error')
                        }
                    })
            } catch (e) {
                setAlert(e, 'error')
            }
        }
    }
    return (
        <View style={styles.root}>
            <Image source={Logo} style={styles.logo} resizeMode={'contain'}/>
            <CustomInput value={firstName} setValue={setFirstName} placeholder={'First Name'}/>
            <CustomInput value={lastName} setValue={setLastName} placeholder={'Last Name'}/>
            <CustomInput value={email} setValue={setEmail} placeholder={'Email'}/>
            <CustomInput value={password} setValue={setPassword} placeholder={'Password'} secureTextEntry={true}/>
            <CustomInput value={confirmPassword} setValue={setConfirmPassword} placeholder={'Confirm Password'}
                         secureTextEntry={true}/>
            <CustomButton text={'Sign Up'} onPress={signUp}/>
            <View id={'errors'} style={styles.errors}>
                <Text ref={length8} style={styles.error_text}>Password needs to be at least 8 characters long</Text>
                <Text ref={passMatch} style={styles.error_text}>Passwords need to match</Text>
            </View>
            <Text>Already have an account? <Text onPress={() => navigation.navigate('Login')}>Login</Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        position: 'relative',
        height: '100%',
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        height: '40%',
        maxHeight: 300
    },
    error_text: {
        color: 'green'
    }
})
