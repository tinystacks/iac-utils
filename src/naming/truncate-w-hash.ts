import crypto from 'crypto';

function truncateWithSemiHash (name: string, maxLength: number) {
  if (name.length > maxLength) {
    const hash = crypto.createHash('md5').update(name).digest('hex');
    
    // last 8 characters yields a 0.000005 chance of collision
    const semiHash = hash.substring(hash.length - 8);
    
    const truncName = name.substring(0, maxLength - 8);
    return truncName + semiHash;
  } else {
    return name;
  }
}

export {
  truncateWithSemiHash
};