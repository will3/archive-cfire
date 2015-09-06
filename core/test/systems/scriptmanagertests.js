var expect = require('chai').expect;
var sinon = require('sinon');

var EntityManager = require('../../entitymanager');
var ScriptManager = require('../../systems/scriptmanager');
var Entity = require('../../entity');
var Component = require('../../component');

//creates a entity with id
var createEntity = function(id) {
    var entity = new Entity();
    entity.id = id;
    return entity;
}

//creates a component with id
var createComponent = function(id) {
    var component = new Component();
    component.id = id;
    return component;
}

//creates a mock entity with id
var createMockEntity = function(id) {
    var entity = new Entity();
    entity.id = id;
    return sinon.mock(entity);
}

var createMockComponent = function(id) {
    var component = new Component();
    component.id = id;
    return sinon.mock(component);
};

describe('ScriptManager', function() {
    var entityManager, scriptManager;

    beforeEach(function() {
        entityManager = new EntityManager();
        scriptManager = new ScriptManager();
    });

    it('should tick components', function() {
        var mockComponent = createMockComponent(2345);
        var entity = createEntity(1234);

        entityManager.addEntity(entity);
        entityManager.addComponent(entity, mockComponent.object);

        mockComponent.expects('tick');

        scriptManager.tick(entityManager);

        mockComponent.verify();
    });

    it('should tick child entities components', function() {
        var mockComponent = createMockComponent(1234);
        var entity = createEntity(2345);
        var parentEntity = createEntity(3456);

        entityManager.addEntity(parentEntity);
        entityManager.addEntity(entity, parentEntity);
        entityManager.addComponent(entity, mockComponent.object);

        mockComponent.expects('tick');

        scriptManager.tick(entityManager);

        mockComponent.verify();
    });

    it('should after tick components', function() {
        var mockComponent = createMockComponent(2345);
        var entity = createEntity(1234);

        entityManager.addEntity(entity);
        entityManager.addComponent(entity, mockComponent.object);

        mockComponent.expects('afterTick');

        scriptManager.afterTick(entityManager);

        mockComponent.verify();
    });

    it('should after tick child entities components', function() {
        var mockComponent = createMockComponent(1234);
        var entity = createEntity(2345);
        var parentEntity = createEntity(3456);

        entityManager.addEntity(parentEntity);
        entityManager.addEntity(entity, parentEntity);
        entityManager.addComponent(entity, mockComponent.object);

        mockComponent.expects('afterTick');

        scriptManager.afterTick(entityManager);

        mockComponent.verify();
    });
});