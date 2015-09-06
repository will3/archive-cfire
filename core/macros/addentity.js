module.exports = function(entity) {
    require('./getgame')().entityManager.addEntity(entity);
};