/* eslint no-undef: 0 */
const prsEnv = process.env.ENV || 'env';
describe('Should call progress', function () {
  it('signByFileReader', async function () {
    try {
      const prs = new PRS({
        env: prsEnv,
        debug: true,
        privateKey: '2b8b3ef68fa54d1af878063541e629e62b22764ab58400a3423d778bc0949b9a',
        address: '86248535534919506cc130b21a32383cf36c5b6a'
      });

      const fileInput = document.getElementById('fileInput');
      const formObj = {
        title: 'test title',
        file: fileInput.files[0]
      };
      console.log(formObj);
      const res = await prs.file.signByFileReader(formObj, onUploadProgress, onHashProgress);
      chai.expect(res.status).to.equal(200);
      chai.expect(res.body).to.have.property('block');
      chai.expect(res.body).to.have.property('cache');
    } catch (e) {
      chai.should().fail(e);
    }
    function onUploadProgress (e) {
      console.log(`${e.type}: ${e.loaded}/${e.total} bytes(${e.percent}%) transferred`);
    }
    function onHashProgress (percent) {
      console.log(`hash ${percent}`);
    }
  }).timeout(30000);
});
