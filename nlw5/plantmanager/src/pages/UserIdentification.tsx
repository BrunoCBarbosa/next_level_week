import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export function UserIdentification(){
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false)
  const [name, setName] = useState<string>()

  const navigation = useNavigation();

  function handleSubmit(){
    navigation.navigate('Confirmation')
  }


  function handleInputBlur(){
    setIsFocused(false);
    setIsFilled(!!name);
  }

  function handleInputFocus(){
    setIsFocused(true);
  }

  function handleInputChange(value: string){
    setIsFilled(!!value);
    setName(value);
  }

  return(
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={styles.emoji}>
                { isFilled ? '😄' : '😅'}
              </Text>
            </View>
            <Text style={styles.title}>
              Como podemos {'\n'} 
              chamar você?
            </Text>
            <TextInput 
              style={[
                styles.input,
               (isFocused || isFilled) && { borderColor: colors.green }
              ]} 
              placeholder="Digite o nome" 
              onBlur={handleInputBlur} 
              onFocus={handleInputFocus}
              onChangeText={handleInputChange}
            />
            <View style={styles.footer}>
              <Button title="Confirmar" onPress={handleSubmit}/>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },

  content:{
    flex:1,
    width: '100%'
  },

  form:{
    flex:1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center',
  },

  header:{
    alignItems: 'center'
  },

  emoji:{
    fontSize: 44
  },

  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },

  title:{
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20
  },

  footer:{
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20
  }
})