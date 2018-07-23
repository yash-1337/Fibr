# Fibr

### A handy cli application that lets you save your custom boilerplates for use later on.

## Install

you can install Fibr using npm, node's default package manager.

`npm i -g fibr`

## Usage

As a cli tool:

```
$ Fibr -h

  Usage: index [options] [command]

  Options:

    -v, --version                     output the version number
    -h, --help                        output usage information

  Commands:

    list                              list all the currently stored boilerplates
    save [options] [dir]              store a project as a boilerplate
    new|load [options] <boilerplate>  load existing boilerplate into project
    update [options] <title>          update a stored boilerplate
    remove|rm <title>                 delete a stored boilerplate

  Options:
    fibr save [options]:
      -t, --title: specifiy what to name your boilerplate.
                defaults to project folder name.
    fibr new|load [options]:
      -d, --dir: specifiy what folder to load boilerplate into.
                defaults to current working directory.
    fibr update [options]:
      -d, --dir: specifiy the folder that has the updated boilerplate code.
                defaults to current working directory.

  Examples:
    $ fibr list
    $ fibr save ./ --title html5_boilerplate
    $ fibr new html5_boilerplate --dir ./
    $ fibr update html5_boilerplate --dir ./
    $ fibr remove html5_boilerplate

```

## How It Works

Fibr saves all the boilerplates to a hidden folder: 

`%USER_HOME_DIR%/.boilerplates/`

*Note: It is advised that you do not change the contents of the folder manually, and that you use the Fibr cli tool to save/load/update/delete boilerplates.*

## Meet the Author

Fibr was created by Yash Patel. Yash is currently 15 years old, and he is a high school student. He loves programming, and knows many languages, such as HTML/CSS/JS, Python, and Java. He is currently pursuing a career in the field of AI and Machine Learning.

## Licence
### MIT