import React from "react";
import {Text,View,ScrollView,FlatList,StyleSheet,TextInput,TouchableOpacity} from "react-native";
import db from '../config';
import Transaction from "./transaction";

export default class Search extends React.Component{
    constructor(props){
        super(props)
        this.state={allTransactions:[],
        lastTransaction:null,
        search:""
        }
    }
    componentDidMount=async()=>{
        const ref=await db.collection("transactions").limit(10).get()
        ref.docs.map(doc=>{
            this.setState({
                allTransactions:[],
                lastTransaction:doc
            })
        })
    }
fetchMoreTransactions=async()=>{
    var text =this.state.search
    var text1= text.split("")
    if(text1[0].toUpperCase()==='B'){

    
    const ref=await db.collection("transactions").where("bookId","==",text).startAfter(this.state.lastTransaction).limit(10).get()
        ref.docs.map(doc=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastTransaction:doc
            })
        })
    }
    else if(text1[0].toUpperCase()==='S'){

    
        const ref=await db.collection("transactions").where("studentId","==",text).startAfter(this.state.lastTransaction).limit(10).get()
            ref.docs.map(doc=>{
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastTransaction:doc
                })
            })
        }
}
searchTransaction=async(text)=>{
    var text1= text.split("")
    console.log(text1)
    this.setState({allTransactions:[]});
    if(text1[0].toUpperCase()==="B"){
        const query= await db.collection("transactions").where("bookId","==",text).get()
            query.docs.map(doc=>{
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastTransaction:doc
                })
            })
    }
        else if(text1[0].toUpperCase()==="S"){
            const query= await db.collection("transactions").where("studentId","==",text).get()
                query.docs.map(doc=>{
                    this.setState({
                        allTransactions:[...this.state.allTransactions,doc.data()],
                        lastTransaction:doc
                    })
                })
}
}

    renderItem=()=>{}
    render(){
        return(
            /*<ScrollView>
                {this.state.allTransactions.map((transaction,index)=>{
                    return(
                        <View style={{borderBottomWidth:2}} key={index}>
                         <Text> {"bookID :"+transaction.bookId} </Text>
                         <Text> {"StudentID :"+transaction.studentId} </Text>
                         <Text> {"Type :"+transaction.transactionType} </Text>
                         <Text> {"Date :"+transaction.date.toDate()} </Text>
                        </View>
                    )
                })}
            </ScrollView>*/
            <View style={styles.container}>
                <View style={styles.searchBar}>
<TextInput style={styles.bar} placeholder="enter studentId or bookID" onChangeText={text=>{this.setState({search:text})}}> </TextInput>
<TouchableOpacity style={styles.searchButton} onPress={()=>this.searchTransaction(this.state.search)}>
    <Text> SEARCH </Text>
</TouchableOpacity>
                </View>

            <FlatList data={this.state.allTransactions} keyExtractor={(item,index)=>index.toString()}
            
            renderItem={({item})=>(
                <View style={{borderBottomWidth:2}}>
                         <Text> {"bookID :"+item.bookId} </Text>
                         <Text> {"StudentID :"+item.studentId} </Text>
                         <Text> {"Type :"+item.transactionType} </Text>
                         <Text> {"Date :"+item.date.toDate()} </Text>
                        </View>
            )}
            onEndReached={this.fetchMoreTransactions}
            onEndReachedThreshold={0.7}
            />

            
            </View>
        )

            
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'green'
    }
  })