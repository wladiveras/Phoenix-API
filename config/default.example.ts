export default {
    name: 'Phoenix',
    port: 3000,

    env: {
        development: true,
        maintenance: false,
    },
    database: {
      mongo: {
        user: 'foo',
        pass: 'baa',
        dbPath: '@someCluster.mongodb.example/myFirstDatabase',
        dbCallback: 'mongodb://127.0.0.1:27017/test'
      },
      mysql: {
          host: 'localhost',
          port: 3306,
          user: 'root',
          pass: '',
          data: 'myFirstDatabase'
      }
    },
    misc: {
        jwtSecret: 'Some-Great-Secret-Jwt',
        refreshSecret: 'Some-Different-Great-Secret-Jwt',
        allowOrigin: ['http://localhost:3000', 'http://127.0.0.1:3000']
    },
}
