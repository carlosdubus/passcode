<?php
namespace Passcode\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * Description of BaseRepository
 *
 * @author Carlos
 */
class BaseRepository extends EntityRepository{
    

    public function findOrCreateFromString($id){
        throw new \Exception("findOrCreateFromString not implemented in ".get_class($this));
    }
    
    public function create(array $data){
        $entity = new $this->_entityName;
        
        $fields = array_values($this->_class->fieldNames);
        
        foreach($fields as $field){
            if(array_key_exists($field, $data)){
                $entity->$field = $data[$field];
            }
        }
        
        $this->_em->persist($entity);
        $this->_em->flush($entity);
        return $entity;
    }
    
    public function findOrCreate($idOrData){
        
        if(!$idOrData){
            return null;
        }
        
        if(is_array($idOrData)){
            return $this->findOrCreateFromData($idOrData);
        }
        elseif(is_numeric($idOrData)){
            return $this->findOrFail($idOrData);
        }
        elseif(is_string($idOrData)){
            return $this->findOrCreateFromString($idOrData);
        }
        
        throw new \Exception("Invalid argument in ".__METHOD__);
    }

    public function findOrCreateMany($arrayOrStringIDs,$delimiter=','){

        $result = new \Doctrine\Common\Collections\ArrayCollection();
        
        if(!is_array($arrayOrStringIDs)){
            $arrayOrStringIDs = explode($delimiter,$arrayOrStringIDs);
        }
        
        
        foreach($arrayOrStringIDs as $id){
            if(is_string($id)){
                $id = trim($id);
            }
            $e = $this->findOrCreate($id);
            if($e){
                $result->add($e);
            }
        }
        
        return $result;
    }

    public function findOrCreateFromData(array $data){
        $entity = new $this->_entityName($data);
        $primaryValues = $this->_class->getIdentifierValues($entity);
        $isNew = empty($primaryValues) || !join('',array_values($primaryValues));
  
        if(!$isNew){
            $entity = $this->findOrFail($primaryValues);
            $entity->fill($data);
        }
        else{
            $this->_em->persist($entity);
        }
        
        return $entity;
    }
    
    public function findMany(array $ids){
        $result = array();
        foreach($ids as $id){
            $result[] = $this->findOrFail($id);
        }
        return $result;
    }
    
    public function findOrCreateOneBy(array $data){
        $entity = $this->findOneBy($data);
        if(!$entity){
            $entity = new $this->_entityName($data);
            $this->_em->persist($entity);
        }
        return $entity;
    }
    
    public function findOrFail($id){
        $entity = $this->find($id);
        if(!$entity){
            throw new \Exception("Entity '".$this->_entityName."' with primary key '$id' not found.");
        }
        return $entity;
    }
}
