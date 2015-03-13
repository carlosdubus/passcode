<?php
namespace Passcode\Controller;
use Illuminate\Support\Facades\Response;
use Passcode\Controller\BaseController;

/**
 * Description of EventController
 *
 * @author Carlos
 */
class EventController extends BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
            $qb = $this->em
                    ->getRepository('pc:Event')
                    ->createQueryBuilder('e')
                    ->select('e.id,e.title,e.image')
                    ->orderBy('e.createdAt','DESC');
            $events = $qb->getQuery()->getArrayResult();
            return Response::json($events);
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		 $qb = $this->em
                    ->getRepository('pc:Event')
                    ->createQueryBuilder('e')
                    ->select('e.id,e.title,e.image,e.description,e.startTime')
                    ->where('e.id = '.(int)$id);
            $events = $qb->getQuery()->getSingleResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
            return Response::json($events);
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}