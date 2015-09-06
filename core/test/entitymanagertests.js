var expect = require('chai').expect;
var sinon = require('sinon');

var EntityManager = require('../entitymanager');
var Entity = require("../entity");

describe('EntityManager', function() {
    var entityManager;

    beforeEach(function() {
        entityManager = new EntityManager();
    });

    //creates a entity with id
    var createEntity = function(id) {
        var entity = new Entity();
        entity.id = id;
        return entity;
    }

    //creates a component with id
    var createComponent = function(id) {
        return {
            id: id
        };
    }

    //creates a mock entity with id
    var createMockEntity = function(id) {
        var entity = new Entity();
        entity.id = id;
        return sinon.mock(entity);
    }

    describe('#addEntity', function() {
        it('should be able to retrieve later', function() {
            var entity = createEntity(1234);
            entityManager.addEntity(entity);
            expect(entityManager.getEntity(1234)).to.equal(entity);
        });

        context('with parent', function() {
            it('should be able to retrieve entity and parent later', function() {
                var entity = createEntity(1234);
                var parentEntity = createEntity(2345);
                entityManager.addEntity(parentEntity);
                entityManager.addEntity(entity, parentEntity);
                expect(entityManager.getEntity(1234)).to.equal(entity);
                expect(entityManager.getParentEntity(1234)).to.equal(parentEntity);
            });

            it('should be able to retrieve from getEntities', function() {
                var entity = createEntity(1234);
                var parentEntity = createEntity(2345);
                entityManager.addEntity(parentEntity);
                entityManager.addEntity(entity, parentEntity);
                expect(entityManager.getEntities(2345)).to.contain(entity);
            });
        });
    });

    describe('#removeEntity', function() {
        it('should not be able to retrieve later', function() {
            var entity = createEntity(1234);
            entityManager.addEntity(entity);
            entityManager.removeEntity(1234);
            expect(entityManager.getEntity(1234)).to.be.null;
        });

        it('should remove child entities', function() {
            var parentEntity = createEntity(2345);
            var entity = createEntity(1234);
            entityManager.addEntity(parentEntity);
            entityManager.addEntity(entity, parentEntity);
            entityManager.removeEntity(2345);
            expect(entityManager.getEntity(1234)).to.be.null;
        });

        it('should remove components', function() {
            var entity = createEntity(1234);
            var component = createComponent(9999);
            entityManager.addEntity(entity);
            entityManager.addComponent(entity, component);
            entityManager.removeEntity(1234);
            expect(entityManager.getComponent(9999)).to.be.null;
        });

        it('should remove child entities components', function() {
            var entity = createEntity(1234);
            var parentEntity = createEntity(2345);
            var component = createComponent(9999);
            entityManager.addEntity(parentEntity);
            entityManager.addEntity(entity, parentEntity);
            entityManager.addComponent(entity, component);
            entityManager.removeEntity(2345);
            expect(entityManager.getComponent(9999)).to.be.null;
        });

        it('should remove from parents child entities', function() {
            var entity = createEntity(1234);
            var parentEntity = createEntity(2345);
            entityManager.addEntity(parentEntity);
            entityManager.addEntity(entity, parentEntity);
            entityManager.removeEntity(1234);
            expect(entityManager.getEntities(2345)).to.be.empty;
        });
    });

    describe('#addComponent', function() {
        it('should retrive from getComponents', function() {
            var entity = createEntity(1234);
            var component = createComponent(9999);
            entityManager.addEntity(entity);
            entityManager.addComponent(entity, component);
            expect(entityManager.getComponents(1234)).to.contain(component);
        });

        it('should retrieve with getComponent', function() {
            var entity = createEntity(1234);
            var component = createComponent(9999);
            entityManager.addEntity(entity);
            entityManager.addComponent(entity, component);
            expect(entityManager.getComponent(9999)).to.equal(component);
        });
    });

    describe('#removeComponent', function() {
        it('should remove from entitys components', function() {
            var entity = createEntity(1234);
            var component = createComponent(9999);
            entityManager.addEntity(entity);
            entityManager.addComponent(entity, component);
            entityManager.removeComponent(9999);
            expect(entityManager.getComponents(1234)).to.be.empty;
        });
    });

    describe('entity life time', function() {
        it('should call afterInit after addEntity', function() {
            var mockEntity = createMockEntity(1234);
            mockEntity.expects('afterInit');
            entityManager.addEntity(mockEntity.object);
            mockEntity.verify();
        });
    });
});