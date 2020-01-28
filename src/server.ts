import app from './app';

app.listen(app.get('port'), () => {
  console.log(`API Listening Port: ${app.get('port')}`);
});
