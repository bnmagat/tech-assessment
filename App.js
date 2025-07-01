import React, { useState } from 'react';
import * as data from './data.json';
import { Alert, Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const App = () => {
    const [textObj, setTextObj] = useState({});
    const [showButton, setShowButton] = useState(false);

    const handleAlert = (item) => {
        let regex = /\$\{([^}]+)\}/g //regex to check all strings inside ${}
        let matches = [...item.AlertMessage.matchAll(regex)]; //gets all matched strings 
        let message = item.AlertMessage;
        let visibleCondition = item.VisibleCondition;
        for (const match of matches) {
            if(visibleCondition.ID === match[1] && visibleCondition.Operator === 'Equals' && visibleCondition.Value === textObj[match[1]]){
                setShowButton(true);
            }else{
                setShowButton(false);
            }
        }
        Alert.alert(message.replace(/[\$\{\}]/g, '')) //remove all ${} syntax
    }

    const onChangeText = (item, val) => {
        let visibleCondition = data.Fields?.find(i => i.Type === 'Button')?.VisibleCondition;

        if(visibleCondition.ID === item.ID){
            if((visibleCondition.Operator === 'Equals' && visibleCondition.Value === val) || (visibleCondition.Operator === 'NotEquals' && visibleCondition.Value !== val)){
                setShowButton(true)
            }else{
                setShowButton(false)
            }
        }

        
    }

    const renderItem = ({item}) => {
        switch(item.Type){
            case "H1":
                return item.Text && <Text style={[styles.H1, styles.text]}>{item.Text}</Text>;
            case "Text":
                return <TextInput
                    style={styles.formInput}
                    onChangeText={(val) => onChangeText(item, val)}
                    placeholder={item.Placeholder}
                    placeholderTextColor="#808080"
                />
            case "Button":
                return showButton && <View style={{marginVertical: 4}}><Button title={item.Title} color={item.Color || '#04AA6D'} onPress={() => item.AlertMessage && handleAlert(item)}/></View>
            default:
                return item.Text && <Text style={[styles[item.Type], styles.text]}>{item.Text}</Text>;
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.title}>{data.Title}</Text>
                <Text style={styles.subtitle}>{data.Subtitle}</Text>
                <FlatList data={data.Fields} renderItem={renderItem} contentContainerStyle={{flexGrow: 1}} nestedScrollEnabled={true}/>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        color: '#5a5a5a',
        fontSize: 20
    },
    subtitle: {
        color: '#a6a6a6',
        fontSize: 14
    },
    text: {
        color: '#5a5a5a',
    },
    H1:{
        fontSize: 32
    },
    H2:{
        fontSize: 28
    },
    H3:{
        fontSize: 22
    },
    H4:{
        fontSize: 16
    },
    H5:{
        fontSize: 16
    },
    H6:{
        fontSize: 14
    },
    formInput: {
        fontSize: 14,
		color: "#000",
		paddingHorizontal: 8,
        borderWidth: 0.8,
        borderColor: "#C0C0C0",
        borderRadius: 8,
        backgroundColor: "#FFF",
        height: 48,
        marginVertical: 8,
    },
});

export default App;
