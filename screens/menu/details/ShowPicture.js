import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class ShowPicture extends React.Component {
    render() {
        const { navigation } = this.props;
        const url = navigation.getParam('url');
        return (
            <View style = {{flex : 1}}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                        <MaterialIcons name='arrow-back' size={40} style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                </View>
                <View style = {styles.image}>
                    <Image source={{uri : url} }style = {styles.size} />
                </View>
            </View>
        )
    }
}
const { width, height } = Dimensions.get("screen");
const topBarHeight = height * 0.09;

var styles = StyleSheet.create({
    topBar: {
        height: topBarHeight,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    backButton: {
        position: 'absolute',
        bottom: 0,
        left: 10
    },
    image : {
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1,
    },
    size : {
        width : width,
        height : height,
        resizeMode : 'center',
        flex : 1
    }
})