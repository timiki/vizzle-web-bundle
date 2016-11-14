<?php

namespace Vizzle\WebBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class WebController extends Controller
{
    /**
     * @Route("/tpl/schedule.html", name="web.tpl.schedule")
     */
    public function getScheduleTplAction()
    {
        return $this->render('VizzleWebBundle:Tpl:schedule.html.twig');
    }

    /**
     * @Route("/tpl/tasks/queue.html", name="web.tpl.tasks.queue")
     */
    public function getTasksQueueTplAction()
    {
        return $this->render('VizzleWebBundle:Tpl:tasks.queue.html.twig');
    }

    /**
     * @Route("/tpl/servers.html", name="web.tpl.servers")
     */
    public function getServersTplAction()
    {
        return $this->render('VizzleWebBundle:Tpl:servers.html.twig');
    }

    /**
     * @Route("/tpl/services.html", name="web.tpl.services")
     */
    public function getServicesTplAction()
    {
        return $this->render('VizzleWebBundle:Tpl:services.html.twig');
    }

    /**
     * @Route("/tpl/logs.html", name="web.tpl.logs")
     */
    public function getLogsTplAction()
    {
        return $this->render('VizzleWebBundle:Tpl:logs.html.twig');
    }
}
