import React from "react";
import {TouchableOpacity,View,StyleSheet,Text , Image, TextInput,KeyboardAvoidingView,ToastAndroid} from "react-native";
import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner";
import db from "../config"
import firebase from "firebase"
export default class Transaction extends React.Component{
    constructor(){
        super()
        this.state={
            hasCamPermissions:null,
            scanned:false,
            buttonState:"normal",
            scannedBookId:"",
            scannedStudentId:"",

        }
    }
    getCamPermission=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCamPermissions:status==="granted",
            buttonState: id,
            scannned:false,

        })
    }
    handleTransaction=async()=>{
        var transactionType=await this.checkBookEligibility()
        console.log(transactionType)
        if(!transactionType){
            alert("the book dosent exist in the database")
            this.setState({scannedStudentId:"",scannedBookId:""})
        }
        else if(transactionType==="issue"){
            console.log("inside issue")
            var eligible=await this.checkstudenteligibilityforbookissue()
            console.log(eligible)
            if(eligible){
            
            this.initiatebookissue()
            alert ("book issued to the student")
            }
        }
        else{var eligible=await this.checkstudenteligibilityforbookreturn()
        if(eligible){
            this.initiatebookreturn()
            alert("book returned by the student")
        }
        }

    }
    checkstudenteligibilityforbookissue=async()=>{
      const ref =await db.collection("Students").where("studentId","==",this.state.scannedStudentId).get()
          console.log("inside student eligible")
          var eligible=""
          if(ref.docs.length===0){
              this.setState({
                  scannedStudentId:"",
                  scannedBookId: ""
              })
              eligible=false
              alert("student does not exist in the database")
          }
          else{

              ref.docs.map(doc =>{
                  var student= doc.data()
                  console.log(student)
                  if(student.noofbookissued<2){
                      eligible=true;
                  }
                  else{eligible= false
                alert("student already issued two books")
                this.setState({
                    scannedStudentId:"",
                    scannedBookId: ""
                })
                }
                
              })

          }
      return eligible
    }
    checkstudenteligibilityforbookreturn=async()=>{
        const ref =await db.collection("transactions").where("bookId","==",this.state.scannedBookId).limit(1).get()
        var eligible =""
        ref.docs.map(doc =>{
            var lasttransaction=doc.data()
            if(lasttransaction.studentId===this.state.scannedStudentId){
                eligible=true
            }
            else{
                eligible=false
                alert("student who took the book was different")
                this.setState({
                    scannedStudentId:"",
                    scannedBookId: ""
                })
            }
        })
        return eligible
    }
    checkBookEligibility=async()=>{
        const ref= await db.collection("books").where("bookId","==",this.state.scannedBookId).get()
        var type=""
        if(ref.docs.length===0){
            type=false
        }
        else{
            ref.docs.map(doc=>{
                var book=doc.data()
                if(book.bookavail){
                    type="issue"
                }
                else{
                    type="return"
                }
            })
        }
    return type
    }
    initiatebookissue=async()=>{
       db.collection("transactions").add(
           {studentId:this.state.scannedStudentId,
        bookId:this.state.scannedBookId,
    date:firebase.firestore.Timestamp.now().toDate(),
transactionType:"issued"})
db.collection("books").doc(this.state.scannedBookId).update({
    bookavail:false
})
db.collection("Students").doc(this.state.scannedStudentId).update({
    noofbookissued:firebase.firestore.FieldValue.increment(1)
})
this.setState({scannedBookId:"",scannedStudentId:""})
    }

    initiatebookreturn=async()=>{
        db.collection("transactions").add(
            {studentId:this.state.scannedStudentId,
         bookId:this.state.scannedBookId,
     date:firebase.firestore.Timestamp.now().toDate(),
 transactionType:"returned"})
 db.collection("books").doc(this.state.scannedBookId).update({
     bookavail:true
 })
 db.collection("Students").doc(this.state.scannedStudentId).update({
     noofbookissued:firebase.firestore.FieldValue.increment(-1)
 })
 this.setState({scannedBookId:"",scannedStudentId:""})
     }
handleBarcode=async({type,data})=>{
    var {buttonState}=this.state
    if(buttonState==="bookId"){

    
    this.setState({
        scanned:true,
        scannedBookId:data,
        buttonState:"normal"
    })}
    else if(buttonState==="studentId"){
        this.setState({
            scanned:true,
            scannedStudentId:data,
            buttonState:"normal"
        }) 
    }
}
    render(){
        const hasCamPermissions=this.state.hasCamPermissions
        const scanned=this.state.scanned
        const buttonState=this.state.buttonState
        if(buttonState!=="normal"&&hasCamPermissions){
            return(
                <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scanned?undefined:this.handleBarcode }></BarCodeScanner>
            )
        }
        else if (buttonState==="normal"){
      return(
           <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
               <View>
                   <Image source={require("../assets/booklogo.jpg")} style={{width:200,height:200}}></Image>
                   <Text style={{fontSize:30, textAlign:"center"}}> WILY </Text>
               </View>
               <View style={styles.inputView}>
                   <TextInput value={this.state.scannedBookId} style={styles.inputBox} placeholder="bookId" onChangeText={txt=>{
                       this.setState({scannedBookId:txt})
                   }}/>
                   <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getCamPermission("bookId")}}> 
                   <Text style={styles.buttonText}> Scan </Text>
                   </TouchableOpacity>
               </View>
               <View style={styles.inputView}>
                   <TextInput value={this.state.scannedStudentId} style={styles.inputBox} placeholder="studentId" onChangeText={txt=>{
                       this.setState({scannedStudentId:txt})
                   }}/>
                   <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getCamPermission("studentId")}}> 
                   <Text style={styles.buttonText}> Scan </Text>
                   </TouchableOpacity>
               </View>
               <TouchableOpacity style={styles.submitButton}onPress={async()=>this.handleTransaction()}>
                   <Text> submit </Text>
               </TouchableOpacity>
            </KeyboardAvoidingView>
        )}
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    }
  });