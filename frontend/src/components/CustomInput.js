/* eslint-disable */
import {StyleSheet, TextInput, View} from "react-native";
import {designChoices} from "../../GlobalConsts";

export const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
      <View style={styles.container}>
          <TextInput value={value} onChangeText={setValue} placeholder={placeholder} secureTextEntry={secureTextEntry}/>
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designChoices.offWhite,
        width: '100%',
        borderRadius: 3,
        paddingHorizontal: 10,
        marginVertical: 5
    },
    tInput: {

    }
})