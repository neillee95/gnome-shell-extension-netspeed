# Makefile for NetSpeed extension

schemas_dir = $(DESTDIR)/schemas
schema_file = org.gnome.shell.extensions.netspeed.gschema.xml

all: compile-schemas

compile-schemas:
	glib-compile-schemas schemas/

install:
	mkdir -p $(schemas_dir)
	cp schemas/$(schema_file) $(schemas_dir)/
	glib-compile-schemas $(schemas_dir)/

clean:
	rm -f schemas/gschemas.compiled

test: compile-schemas
	echo "Schema compiled successfully"

.PHONY: all compile-schemas install clean test