import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Dialog from "react-native-dialog";
import * as obj from './data.json';

const App = () => {
    const [textObj, setTextObj] = useState({});
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState('');
    const [data, setData] = useState(obj)


    useEffect(() => {
        console.log('data',data)
    },[data])

    const handleAlert = (item) => {
        let regex = /\$\{([^}]+)\}/g //regex to check all strings inside ${}
        let matches = [...item.AlertMessage.matchAll(regex)]; //gets all matched strings 
        let message = item.AlertMessage;
        for (const match of matches) {
            message = message.replace(match[1], textObj[match[1]] ?? '') //replace matched string with actual value
        }
        Alert.alert(message.replace(/[\$\{\}]/g, '')) //remove all ${} syntax
    }

    const renderItem = ({item}) => {
        switch(item.Type){
            case "H1":
                return item.Text && <Text style={[styles.H1, styles.text]}>{item.Text}</Text>;
            case "Text":
                return (
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={styles.formInput}
                                onChangeText={val => setTextObj(prev => ({...prev, [item.ID]: val}))}
                                placeholder={item.Placeholder}
                                placeholderTextColor="#808080"
                            />
                        </View>
                        <Pressable style={{justifyContent: 'center', paddingHorizontal: 16}} onPress={() => onDeleteItem(item)}>
                            <Text>X</Text>
                        </Pressable>
                    </View>
                )
            case "Button":
                return <View style={{marginVertical: 4}}><Button title={item.Title} color={item.Color || '#04AA6D'} onPress={() => item.AlertMessage && handleAlert(item)}/></View>
            default:
                return item.Text && <Text style={[styles[item.Type], styles.text]}>{item.Text}</Text>;
        }
    }

    const onAddItem = () => {
        let item = {ID: id, Type: 'Text', Placeholder: 'John Smith'};
        setData(prev => ({...prev, Fields: [...data.Fields, item]}))
        setVisible(false);
    }

    const onDeleteItem = (item) => {
        let temp = data.Fields?.filter(i => i.ID !== item.ID);
        setData(prev => ({...prev, Fields: temp}));
    }
    

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.title}>{data.Title}</Text>
                <Text style={styles.subtitle}>{data.Subtitle}</Text>
                <FlatList data={data.Fields} renderItem={renderItem} contentContainerStyle={{marginVertical: 16}} />
                <Button title={'Add'} color={'#04AA6D'} onPress={() => setVisible(true)}/>
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Account delete</Dialog.Title>
                    <Dialog.Description>
                        Enter id below
                    </Dialog.Description>
                    <Dialog.Input onChangeText={val => setId(val)}/>
                    <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
                    <Dialog.Button label="Add" onPress={onAddItem} />
                </Dialog.Container>
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
