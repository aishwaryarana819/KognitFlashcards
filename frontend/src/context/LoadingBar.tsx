import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withDelay,
    Easing,
} from 'react-native-reanimated';

import {useLoading} from './LoadingContext';

export default function LoadingBar() {
    const {isLoading} = useLoading();

    const progress = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (isLoading) {
            opacity.value = withTiming(1, {duration: 200});
            progress.value - withRepeat(withTiming(1, {
                duration: 1200, easing: Easing.inOut(Easing.ease)
            }),
                -1,
                true)
            ;
        }
        else {
            progress.value = withTiming(1, {duration: 200});
            opacity.value = withDelay(300, withTiming(0, {
                duration: 300
            }, () => {
                progress.value = 0;
            }));
        }
    }, [isLoading]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
            opacity: opacity.value,
        };
    });

    return (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, pointerEvents: 'none'}}>
            <Animated.View
                style={[animatedStyle, {height: '100%', backgroundColor: '#B193DC'}]}
            />
        </View>
    );
}