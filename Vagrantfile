# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "ubuntu/trusty64"

  # The url from where the 'config.vm.box' box will be fetched if itcd /v
  # doesn't already exist on the user's system.
  config.vm.box_url = "http://files.vagrantup.com/trusty64.box"

  # Enable the Puppet provisioner, with will look in manifests
  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "puppet/manifests"
    puppet.manifest_file = "default.pp"
    puppet.module_path = "puppet/modules"
  end

  config.vm.synced_folder ".", "/vagrant", :owner => "www-data", :mount_options => ["dmode=777","fmode=777", "umask=0000","dmask=0000","fmask=0000"]
  config.vm.network :private_network, ip: "192.168.250.123"

  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 27017, host: 27017
end
