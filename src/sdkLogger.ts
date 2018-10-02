function sdkLogger(message?: any, ...optionalParams: any[]) {
  const sdkDebugLog = process.env.SDK_DEBUG_LOG === 'true';
  if (sdkDebugLog) {
    // tslint:disable-next-line:no-console
    console.log(message, ...optionalParams);
  }
}

export default sdkLogger;
