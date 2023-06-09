import 'react-native-reanimated';
import {useCallback, useEffect, useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner';
import {useSharedValue} from 'react-native-reanimated';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const ScanBarcodeScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back;

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  // const detectorResult = useSharedValue('');

  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
  //   const barcodesStr = detectedBarcodes
  //     .map(barcode => barcode.displayValue)
  //     .join('');
  //   console.log('Barcodes:', barcodesStr);
  //   detectorResult.value = barcodesStr;
  // }, []);

  // const [barcode, setBarcode] = useState('');
  // const [isScanned, setIsScanned] = useState(false);
  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  // useEffect(() => {
  //   if (barcodes && barcodes.length > 0 && isScanned === false) {
  //     setIsScanned(true);
  //     barcodes.forEach(async scannerBarcode => {
  //       if (scannerBarcode.rawValue !== '') {
  //         setBarcode(`${scannerBarcode.rawValue}`);
  //       }
  //     });
  //   }
  // }, [barcodes]);

  const onSuccess = (e: any) => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err),
    );
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const onBarcodeRead = (event: any) => {
    console.log('Scanned barcode:', event.data);
    // Handle the scanned barcode data here
  };

  return (
    <View style={styles.container}>
      {/* {!device ? (
        <Text>No camera device available</Text>
      ) : (
        <>
        
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'red',
          }}>
          <Camera
            style={{width: '100%', height: '100%'}}
            device={device}
            isActive={true}
            enableZoomGesture
            // frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        </View>

        <QRCodeScanner
          onRead={onSuccess}
          // flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <Text style={styles.centerText}>
              Go to{' '}
              <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
              your computer and scan the QR code.
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
          }
        />
        </>

      )} */}

      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onBarCodeRead={onBarcodeRead}
        barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default ScanBarcodeScreen;
