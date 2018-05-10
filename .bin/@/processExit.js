module.exports = (code, signal) => {
  let error = null;
  if (signal) {
    error = new Error(`Exited with signal ${signal}`, code);
    error.exitSignal = signal;
    return error;
  }
  if (code) {
    error = new Error(`Exited with status ${code}`, code);
    error.exitStatus = code;
  }
  return error;
};
