abstract base controller
aufgabe: implementiert die findMethoden fuer alle Entities E

API

public
methods                             route                   rest

getService() (findService)          /                       -
getMapper() (EntityMapper)          /                       -

validateDto(DTO dto)
validateId(ID id)

performCreate(E Entity)
performRead(ID id, boolean eager, Consumer<E> additionalValidation)
performUpdate(ID id, DTO dto, 
                Consumer<E> additionalValidation,
                Function<E, E> updater)

abstract crud controller
aufgabe: create, reads, update, delete fuer alle top level Entities E

public methods

getService() (crudServie)
getMapper() (EntityMapper)
create(@RequestBody dto)            /                       post
get()                               /{"id"}                 get
getLazy()                           /{"id"}/lazy            get
update(id, @RequestBody dto)        /{"id"}                 put
delete(id)                          /{"id"}                 delete



die oberen beide sind funktional fertig brauchen noch:
    -logging
    -swaggerannotations (fuer api doku)
    -@valid vor den dtos => validierung in dtos hinzufuegen

API abstract nested controller

getService()                        
getMapper()     
getParent(PID parentId)                         
belongsToParent(E entity, P parent)
create(@RequestBody dto)            /                       post
findAllByParentId(parentId,eager)   /                       get
get()                               /{"id"}                 get
getLazy()                           /{"id"}/lazy            get
update(@RequestBody dto)            /{"id"}                 put
delete()                            /{"id"}                 delete

was ist doppelt:

getService()
getMapper()

create() -> einfach an service delegieren aber crud hat crudService und nested nesteService ??
gets by id nested muss gucken ob die zum parent gehoeren
update das geleiche
delete das gleiche 