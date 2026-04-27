import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    errorMsg: string;
}

export default class ErrorBoudnary extends Component<Props, State>
{
    public state: State = {
        hasError: false,
        errorMsg: "",
    };

    public static getDerivedStateFromError(error: Error): State {
        return {hasError: true, errorMsg: error.message};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error encountered: ', error, errorInfo);
    }

    public handleReset = () => {
        this.setState({hasError: false, errorMsg: ""});
    };

    public render() {
        if (this.state.hasError) {
            return (
                <View style={{flex: 1, backgroundColor: "#1A1A1A",
                    alignItems: 'center', justifyContent: 'center', padding: 24}}>
                    <Ionicons name="warning-outline" size={80} color="#B193DC" style={{marginBottom: 20}}/>

                    <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8,
                        textAlign: 'center', fontFamily: 'Urbanist_400Regular'}}>
                        Something went wrong.
                    </Text>

                    <Text style={{color: '#9CA3AF', fontSize: 16, textAlign: 'center', marginBottom: 32,
                        fontFamily: 'Manrope_400Regular'}}>
                        {this.state.errorMsg || "An unexpected error was encountered."}
                    </Text>

                    <TouchableOpacity onPress={this.handleReset} style={{backgroundColor: '#B193DC', paddingHorizontal: 32,
                        paddingVertical: 12, borderRadius: 9999, flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="refresh" size={20} color="#FFFFFF" style={{marginRight: 8}}/>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}