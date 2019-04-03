'use strict';

exports.developer = {
  email: 'test2@press.one',
  keystore: '{"address":"86248535534919506cc130b21a32383cf36c5b6a","crypto":{"cipher":"aes-128-ctr","ciphertext":"61d44823cfbadd15d67aba4167fe561b423168c04e99e609f9613212577d50fb","cipherparams":{"iv":"cb83cc76bf8f388f705173182613a442"},"mac":"856d5fa3af2060bfc71b395487cd428302539565602a61b4921ca3a16592fd5e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"6e023121e6934ae020438852d14214461171e2dce789e67d5472dd069fcd9eea"}},"id":"4cfd24f0-383a-469d-a65c-fe606af49f43","version":3}',
  password: 'nopassword',
  address: '86248535534919506cc130b21a32383cf36c5b6a'
};

exports.user = {
  email: 'foundation@163.com',
  keystore: '{"address":"758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9","crypto":{"cipher":"aes-128-ctr","ciphertext":"92af6f6710eba271eae5ac7fec72c70d9f49215e7880a0c45d4c53e56bd7ea59","cipherparams":{"iv":"13ddf95d970e924c97e4dcd29ba96520"},"mac":"b9d81d78f067334ee922fb2863e32c14cbc46e479eeb0acc11fb31e39256004e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"79f90bb603491573e40a79fe356b88d0c7869852e43c2bbaabed44578a82bbfa"}},"id":"93028e51-a2a4-4514-bc1a-94b089445f35","version":3}',
  password: '123123',
  address: '758ea2601697fbd3ba6eb6774ed70b6c4cdb0ef9'
};

exports.buyer = {
  email: 'test2@press.one',
  keystore: '{"address":"86248535534919506cc130b21a32383cf36c5b6a","crypto":{"cipher":"aes-128-ctr","ciphertext":"61d44823cfbadd15d67aba4167fe561b423168c04e99e609f9613212577d50fb","cipherparams":{"iv":"cb83cc76bf8f388f705173182613a442"},"mac":"856d5fa3af2060bfc71b395487cd428302539565602a61b4921ca3a16592fd5e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"6e023121e6934ae020438852d14214461171e2dce789e67d5472dd069fcd9eea"}},"id":"4cfd24f0-383a-469d-a65c-fe606af49f43","version":3}',
  password: 'nopassword',
  address: '86248535534919506cc130b21a32383cf36c5b6a'
};

exports.avatarBase64String = 'data:image/png;base64,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';
